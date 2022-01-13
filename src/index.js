import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const USERS = [];
const config = {
  secret: "secret_key",
  expiresIn: "1h",
};

const registerSchema = yup.object().shape({
  username: yup.string().required(),
  age: yup.number().positive().required(),
  email: yup.string().email("invalid email address").required(),
  password: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
  uuid: yup.string().default(function () {
    return uuidv4();
  }),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("username required"),
  password: yup.string().required("password required"),
});

const validate = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    const validatedData = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.validatedData = validatedData;
    return next();
  } catch (e) {
    return res.status(422).json({ error: e.errors.join(", ") });
  }
};

const verifyUsername = (req, res, next) => {
  const username = req.body.username;
  const user = USERS.find((user) => user.username === username);

  if (user !== undefined) {
    res.status(400).json({ message: "username already exists" });
  } else {
    next();
  }
};

const authenticateUser = (req, res, next) => {
  let header = req.headers.authorization;

  if (header !== undefined) {
    let token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "invalid token." });
      }
      let user = USERS.find((user) => user.username === decoded.username);
      req.loggedUser = user;
      next();
    });
  } else {
    res.status(401).json({ message: "missing authorization header" });
  }
};

const authorizeUser = (req, res, next) => {
  const { loggedUser } = req;
  const { uuid } = req.params;
  const user = USERS.find((user) => user.uuid === uuid);

  if (user === undefined) {
    res.status(403).json({ message: "invalid uuid" });
  } else if (user.uuid !== loggedUser.uuid) {
    res.status(403).json({ message: "request not allowed" });
  } else {
    next();
  }
};

app.use(express.json());

app.post(
  "/signup",
  validate(registerSchema),
  verifyUsername,
  async (req, res) => {
    try {
      const data = req.validatedData;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      data.password = hashedPassword;

      const { password: data_password, ...dataWithoutPassword } = data;

      USERS.push(data);
      res.status(201).json(dataWithoutPassword);
    } catch (e) {
      console.log(e);
    }
  }
);

app.post("/login", validate(loginSchema), async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = USERS.find((user) => user.username === username);

    if (user !== undefined) {
      const match = await bcrypt.compare(password, user.password);
      const token = jwt.sign(
        { username: username, uuid: user.uuid },
        config.secret,
        { expiresIn: config.expiresIn }
      );

      if (match) {
        res.json({ token: token });
      } else {
        res.status(401).json({ message: "invalid password" });
      }
    } else {
      res.status(401).json({ message: "invalid username" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/users", authenticateUser, (req, res) => {
  res.json(USERS);
});

app.put(
  "/users/:uuid/password",
  authenticateUser,
  authorizeUser,
  async (req, res) => {
    const password = req.body.password;
    const { uuid } = req.params;
    const user = USERS.find((user) => user.uuid === uuid);

    try {
      if (password === undefined) {
        res.status(403).json({ message: "'password' field required" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        res.status(204).json([]);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

app.listen(3000);
