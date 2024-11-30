import Link from "next/link";

import Container from "../layout/container";
import Logo from "./logo";
import Navigation from "./navigation";

const Header = () => {
  return (
    <header className="py-3 backdrop-blur-md bg-background/30">
      <Container className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Navigation />
      </Container>
    </header>
  );
};

export default Header;
