import { Link } from "react-router-dom";

import "../../src/styles/AnimeDetails.css";
import "../../src/styles/EpisodeDetails.css";

const EpisodeDetails = () => {
  return (
    <div>
      <h1>Episode</h1>
      <Link to="/">Back to home</Link>
    </div>
  );
};

export default EpisodeDetails;
