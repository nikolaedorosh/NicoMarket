const express = require("express");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const createError = require("http-errors");
const logger = require("morgan");
const path = require("path");
const hbs = require("hbs");
const { connect } = require("mongoose");
require("dotenv").config();
// process.env.PWD = __dirname
const User = require("./models/userModel");
const Product = require("./models/productModel");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const mainRouter = require("./routes/mainRouter");
const { authenticated } = require("./middleware/mid");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(process.env.PWD, "views"));
hbs.registerPartials(path.join(process.env.PWD, "views", "partials"));

app.use(logger("dev"));
app.use(express.static(path.join(process.env.PWD, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  sessions({
    key: "sid",
    secret: process.env.SECRET_KEY,
    resave: false, // Не сохранять сессию, если мы ее не изменим
    saveUninitialized: false, // не сохранять пустую сессию
    store: MongoStore.create({
      // выбираем в качестве хранилища mongoDB
      mongoUrl: process.env.DB_CONNECTION,
    }),
    cookie: {
      // настройки, необходимые для корректного работы cookie
      httpOnly: true, // не разрещаем модифицировать данную cookie через javascript
      maxAge: 86400 * 1e3, // устанавливаем время жизни cookie
    },
  })
);

app.use(async (req, res, next) => {
  const userId = req.session?.user?.id;
  if (userId) {
    const currentUser = await User.findById(userId);
    if (currentUser) {
      res.locals.name = currentUser.name;
      res.locals.id = currentUser._id;
      res.locals.email = currentUser._email;

      // res.locals.admin = currentUser.role === "admin";
      // res.locals.manager = currentUser.role === "manager";
    }
  }
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/homepage", authenticated, mainRouter);

// Если HTTP-запрос дошёл до этой строчки, значит ни один из ранее встречаемых рутов не ответил на запрос.
// eslint-disable-next-line max-len
// Это значит, что искомого раздела просто нет на сайте. Для таких ситуаций используется код ошибки 404.
// Создаём небольшое middleware, которое генерирует соответствующую ошибку.
app.use((req, res, next) => {
  const error = createError(
    404,
    "Запрашиваемой страницы не существует на сервере."
  );
  next(error);
});

// Отлавливаем HTTP-запрос с ошибкой и отправляем на него ответ.
app.use((err, req, res) => {
  // Получаем текущий ражим работы приложения.
  const appMode = req.app.get("env");
  // Создаём объект, в котором будет храниться ошибка.
  let error;

  // Если мы находимся в режиме разработки, то отправим в ответе настоящую ошибку. В противно случае отправим пустой объект.
  if (appMode === "development") {
    error = err;
  } else {
    error = {};
  }

  // Записываем информацию об ошибке и сам объект ошибки в специальные переменные, доступные на сервере глобально, но только в рамках одного HTTP-запроса.
  res.locals.message = err.message;
  res.locals.error = error;

  // Задаём в будущем ответе статус ошибки. Берём его из объекта ошибки, если он там есть. В противно случае записываем универсальный стату ошибки на сервере - 500.
  res.status(err.status || 500);
  // Формируем HTML-текст из шаблона "error.hbs" и отправляем его на клиент в качестве ответа.
  res.render("error");
});
console.log(process.env.DB_CONNECTION);
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`SERVER ON ${PORT}.`);

  connect(
    process.env.DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log("DATABASE ON 27017");
    }
  );
});

module.exports = app;
