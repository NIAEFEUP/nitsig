import React from "react";
import renderRoot from "~/common/renderRoot";
import Container from "~/components/layout/Container";
import Footer from "~/components/layout/Footer";
import Header from "~/components/layout/Header";
import Main from "~/components/layout/Main";

const IndexPage = () => (
    <Container>
        <Header />
        <Main />
        <Footer />
    </Container>
);

renderRoot(IndexPage);
