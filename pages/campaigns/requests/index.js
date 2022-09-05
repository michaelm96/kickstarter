import React, { useState, useEffect } from "react";
import { Table, Button, Grid } from "semantic-ui-react";
import Layout from "../../../components/layout/layout";
import campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link } from "../../../routes";

function RequestIndex({ address }) {
    const [contract, setContract] = useState(null);
    const [requests, setRequests] = useState([]);
    const [totalContributor, setTotalContributor] = useState(0);
    const [hide, setHide] = useState(true);
    const [user, setUser] = useState("");

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const campaignInstance = await campaign(address);
        setContract(campaignInstance);
        const reqLength = await campaignInstance.methods
            .getRequestsCount()
            .call();
        setTotalContributor(
            await campaignInstance.methods.approversCount().call()
        );
        const manager = await campaignInstance.methods.manager().call();
        let user = await web3.eth.getAccounts();
        if (!user.length) {
            user = await web3.eth.requestAccounts();
        }
        setUser(user[0]);
        if (user[0] === manager) {
            setHide(false);
        }
        const arr = await Promise.all(
            Array(Number(reqLength))
                .fill()
                .map((_, idx) => {
                    return campaignInstance.methods.requests(idx).call();
                })
        );
        setRequests(arr);
    };

    const approveReq = async (idx) => {
        try {
            await contract.methods.approveRequest(idx).send({
                from: user,
                gas: (10 ** 6).toString(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const finalizeReq = async (idx) => {
        try {
            await contract.methods.finalizeRequest(idx).send({
                from: user,
                gas: (10 ** 6).toString(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Layout>
                <div style={{ marginBottom: "2rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "25px" }}>
                        Requests
                    </span>
                    <Button primary floated="right">
                        <Link route={`/campaigns/${address}/requests/new`}>
                            <span style={{ color: "white" }}>Add Request</span>
                        </Link>
                    </Button>
                </div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            {!hide ? (
                                <Table.HeaderCell>Finalize</Table.HeaderCell>
                            ) : (
                                <></>
                            )}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {requests.length ? (
                            requests.map((ele, idx) => {
                                return (
                                    <Table.Row disabled={ele.complete}>
                                        <Table.Cell>{idx + 1}</Table.Cell>
                                        <Table.Cell>
                                            {ele.description}
                                        </Table.Cell>
                                        <Table.Cell>{ele.value}</Table.Cell>
                                        <Table.Cell>{ele.recipient}</Table.Cell>
                                        <Table.Cell>
                                            {ele.approvalCount}/
                                            {totalContributor}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ele.complete === true
                                                ? "Ends"
                                                : "Open"}
                                        </Table.Cell>
                                        <Table.Cell
                                            selectable
                                            positive={!ele.complete}
                                            onClick={() => {
                                                approveReq(idx);
                                            }}
                                        >
                                            <a href="#">Approve</a>
                                        </Table.Cell>
                                        {!hide ? (
                                            <Table.Cell
                                                selectable
                                                negative={!ele.complete}
                                                onClick={() => {
                                                    finalizeReq(idx);
                                                }}
                                            >
                                                <a href="#">Finalize</a>
                                            </Table.Cell>
                                        ) : (
                                            <></>
                                        )}
                                    </Table.Row>
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </Table.Body>
                </Table>
            </Layout>
        </div>
    );
}

RequestIndex.getInitialProps = async (props) => {
    return {
        address: props.query.address,
    };
};

export default RequestIndex;
