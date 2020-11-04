import { Router } from "next/router";
import React from "react";

import { PublicFeed } from "../components/public-feed";

type IndexProps = { router: Router };

function Index({ router }: IndexProps) {
  return <PublicFeed router={router} />;
}

export default Index;
