import React, { useState, useEffect } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/layout/layout";
import campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import Router from "next/router";

function NewRequest({ address }) {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [recipient, setRecipient] = useState("");
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(true);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            let user = await web3.eth.getAccounts();
            const contInst = campaign(address);
            if (!user.length) {
                user = await web3.eth.requestAccounts();
            }
            const managerAddress = await contInst.methods.manager().call();
            if (user[0] === managerAddress) {
                setForbidden(false);
                setContract(contInst);
            }
            setUser(user[0]);
        } catch (error) {
            setMessage(error.message);
            setInterval(() => {
                setMessage("");
            }, 5000);
        }
    };

    const createRequest = async () => {
        try {
            setLoading(true);
            // let user = await web3.eth.getAccounts();
            // if (!user.length) {
            //     user = await web3.eth.requestAccounts();
            // }
            await contract.methods.createRequest(description, amount, recipient).send({
                from: user,
                gas: (10 ** 6).toString(),
            });
            setLoading(false);
            Router.pushRoute("/");
        } catch (error) {
            setLoading(false);
            setMessage(error.message);
            setInterval(() => {
                setMessage("");
            }, 5000);
        }
    };

    return (
        <Layout>
            {message ? (
                <Message error>
                    <Message.Header>Error</Message.Header>
                    <p>{message}</p>
                </Message>
            ) : (
                <></>
            )}
            {!forbidden ? (
                <>
                    <h1>Create a Request</h1>
                    <Form
                        onSubmit={() => {
                            createRequest();
                        }}
                    >
                        <Form.Field>
                            <label>Description</label>
                            <Input type="text" onChange={(e) => {setDescription(e.target.value)}}/>
                            <label>Amount in wei</label>
                            <Input type="text" onChange={(e) => {setAmount(e.target.value)}}/>
                            <label>Recipient</label>
                            <Input type="text" onChange={(e) => {setRecipient(e.target.value)}}/>
                        </Form.Field>
                        <Button primary loading={loading}>Create</Button>
                    </Form>
                </>
            ) : (
                <h1>
                    You have no access to this page
                </h1>
            )}
        </Layout>
    );
}

NewRequest.getInitialProps = async (props) => {
    return {
        address: props.query.address,
    };
};

export default NewRequest;
