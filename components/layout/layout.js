import React from "react";
import { Container } from "semantic-ui-react";
import Header from "../header/header";
import Head from "next/head";

function Layout(props) {
    return (
        <Container>
            {/* <Head> */}
                <link
                    async
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            {/* </Head> */}
            <Header />
            {props.children}
            {/* <div>This is for footer section</div> */}
        </Container>
    );
}

export default Layout;
