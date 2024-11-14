import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

import Layout from "../components/sections/Layout";
import Features from "../components/sections/Features";

const IndexPage = () => (
    <Container>
        <Header />
        <main className="flex flex-col p-2 gap-y-4">
            <Layout />
            <Features />
        </main>
        <Footer />
    </Container>
);

export default IndexPage;
