import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Message,
} from "semantic-ui-react";
import Layout from "../../components/layout/layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from '../../routes';

function New() {
    const [min, setMin] = useState(0);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const create = async () => {
        try {
            setLoading(true);
            let user = await web3.eth.getAccounts();
            if (!user.length) {
                user = await web3.eth.requestAccounts();
            }
            setUser(user[0]);
            await factory.methods.createCampaign(min).send({
                from: user[0],
                gas: (10 ** 6).toString(),
            });
            setLoading(false);
            Router.pushRoute('/');
        } catch (error) {
            setLoading(false);
            setMessage(error.message);
            setInterval(() => {
                setMessage("");
            }, 5000);
        }
    };
    return (
        <div>
            <Layout>
                <h3>Create A Campaign</h3>
                <Form error={!!message}>
                    <Form.Field>
                        <label>Minimum Contribution (wei)</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            onChange={(e) => setMin(e.target.value)}
                        />
                    </Form.Field>
                    {message ? (
                        <Message error>
                            <Message.Header>Error</Message.Header>
                            <p>{message}</p>
                        </Message>
                    ) : (
                        <></>
                    )}
                    <Button primary loading={loading} onClick={create} disabled={!min}>
                        Create!
                    </Button>
                </Form>
            </Layout>
        </div>
    );
}

export default New;
