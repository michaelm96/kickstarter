import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import campaign from "../../ethereum/campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/contributeForm/ContributeForm";
import { Link } from "../../routes";

function Show(props) {
    const { summary, campaignInstance } = props;
    const [contract, setContract] = useState(campaignInstance);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems([
            {
                header: "Manager",
                description: "The Manager address who created this campaign",
                meta: summary.manager,
                style: { overflowWrap: "break-word" },
            },
            {
                header: "Balance",
                description: "total balance of this campaign",
                meta: web3.utils.fromWei(summary.balance, "wei") + " wei",
            },
            {
                header: "Minimal Contribution",
                description: "Minimum contribution to join this campaign",
                meta: summary.minContribution + " wei",
            },
            {
                header: "Contributors",
                description: "Total amount of contributors",
                meta: summary.approversCount,
            },
            {
                header: "Requests Amount",
                description: "Total amount of request that asked by Manager",
                meta: summary.requestsAmount,
            },
        ]);
    }, []);

    return (
        <Layout>
            <h1>{props.query.address}</h1>
            <h3>Campaign Detail</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Card.Group items={items} />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm contract={contract} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button primary>
                            <Link
                                route={`/campaigns/${contract.options.address}/requests`}
                            >
                                <span style={{ color: "white" }}>
                                    View Requests
                                </span>
                            </Link>
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
}

Show.getInitialProps = async (props) => {
    const campaignInstance = await campaign(props.query.address);
    const summary = await campaignInstance.methods.getSummary().call();
    return {
        campaignInstance,
        query: props.query,
        summary: {
            balance: summary[0],
            minContribution: summary[1],
            requestsAmount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        },
    };
};

export default Show;
