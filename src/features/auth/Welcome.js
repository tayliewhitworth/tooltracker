import useAuth from "../../hooks/useAuth";


const Welcome = () => {
  const { username } = useAuth();

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  return (
    <section className="welcome-section">
      <p>{today}</p>

      <h1>Welcome {username}!</h1>

    </section>
  );
};

export default Welcome;
