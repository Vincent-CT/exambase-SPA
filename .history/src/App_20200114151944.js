import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link,
  Prompt,
  NavLink,
  useHistory
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/");
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <HeaderStart />
          <ContentStart login={login} />
        </div>
      ) : (
        <div>
          <LoggedIn logout={logout} />
        </div>
      )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function LoggedIn({ logout }) {
  return (
    <div>
      <Header />
      <Content logout={logout} />
    </div>
  );
}
const HeaderStart = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/movieinfo">
          MovieInfo Simple
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LogIn login={login} />
      </Route>
      <Route path="/movieinfo">
        <MovieInfo />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/movieinfoall">
            MovieInfo All
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/movieinfo">
            MovieInfo Simple
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/edit">
            Edit
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/user-info">
            Hi! {facade.getUser().username} Role: {facade.getUser().roles}
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/movieinfoall">
          MovieInfo All
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/movieinfo">
          MovieInfo Simple
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/logout">
          Logout
        </NavLink>
      </li>
    </ul>
  );
};

const Content = ({ logout }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/movieinfoall">
        <MovieInfoAll />
      </Route>
      <Route path="/movieinfo">
        <MovieInfo />
      </Route>
      <Route path="/edit">
        <Edit />
      </Route>
      <Route path="/logout">
        <Logout logout={logout} />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

const Home = () => {
  return (
    <div>
      <h3>Welcome to home</h3>
    </div>
  );
};

const MovieInfoAll = () => {
  const emptyMovie = {
    title: "",
    year: 0,
    plot: "",
    directors: "",
    genres: "",
    cast: "",
    poster: ""
  };

  const [movie, setMovie] = useState(emptyMovie);
  const [title, setTitle] = useState("");

  const handleChange = event => {
    const target = event.target;
    setTitle(target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const finalTitle = title.split(" ").join("%20");
    setTitle(finalTitle);
    facade.fetchMovieInfoSimple(title).then(res => setMovie(res));
  };
  return (
    <div className="col-md-8">
      <h3>Search Simple Movie Info</h3>
      <input
        id="title"
        value={title}
        onChange={handleChange}
        placeholder="Enter movie title"
      ></input>
      <br></br>
      <button onClick={handleSubmit}>Search</button>
      <h3>Movie Info</h3>
      <p>{movie.title}</p>
      <p>{movie.year}</p>
      <p>{movie.plot}</p>
      <p>{movie.directors}</p>
      <p>{movie.genres}</p>
      <p>{movie.cast}</p>
      <img src={movie.poster} alt="" height="auto" width="50%"></img>
    </div>
  );
};

const MovieInfo = () => {
  const emptyMovie = {
    title: "",
    year: 0,
    plot: "",
    directors: "",
    genres: "",
    cast: "",
    poster: ""
  };

  const [movie, setMovie] = useState(emptyMovie);
  const [title, setTitle] = useState("");

  const handleChange = event => {
    const target = event.target;
    setTitle(target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const finalTitle = title.split(" ").join("%20");
    setTitle(finalTitle);
    facade.fetchMovieInfoSimple(title).then(res => setMovie(res));
  };

  return (
    <div className="col-md-8">
      <h3>Search Simple Movie Info</h3>
      <input
        id="title"
        value={title}
        onChange={handleChange}
        placeholder="Enter movie title"
      ></input>
      <br></br>
      <button onClick={handleSubmit}>Search</button>
      <h3>Movie Info</h3>
      <p>{movie.title}</p>
      <p>{movie.year}</p>
      <p>{movie.plot}</p>
      <p>{movie.directors}</p>
      <p>{movie.genres}</p>
      <p>{movie.cast}</p>
      <img src={movie.poster} alt="" height="auto" width="50%"></img>
    </div>
  );
};

const Edit = () => {
  return (
    <div>
      <h3>Find and Edit</h3>
    </div>
  );
};

const NoMatch = () => <div>Urlen matcher ingen kendte routes</div>;
export default App;
