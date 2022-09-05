import React, { useState } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import Router from "next/router";

function ContributeForm({ contract }) {
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [message, setMessage] = useState("");

    const contribute = async () => {
        try {
            setLoading(true);
            let user = await web3.eth.getAccounts();
            if (!user.length) {
                user = await web3.eth.requestAccounts();
            }
            setUser(user[0]);
            const campaignInstance = campaign(contract.options.address);

            await campaignInstance.methods.contribute().send({
                from: user[0],
                gas: (10 ** 6).toString(),
                value: amount,
            });

            setLoading(false);
            Router.pushRoute("/");
        } catch (error) {
            console.log(error);
            setLoading(false);
            setMessage(error.message);
            setInterval(() => {
                setMessage("");
            }, 5000);
        }
    };

    return (
        <div>
            <Form
                onSubmit={() => {
                    contribute();
                }}
                error={!!message}
            >
                <Form.Field>
                    <label>Amount to Contribute (wei)</label>
                    <Input
                        type="text"
                        label="wei"
                        labelPosition="right"
                        onChange={(e) => setAmount(e.target.value)}
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
                <Button primary loading={loading}>
                    Contribute!
                </Button>
            </Form>
        </div>
    );
}

export default ContributeForm;
