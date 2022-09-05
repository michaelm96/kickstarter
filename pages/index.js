import React, { useState, useEffect } from "react";
import CampaignsList from "../components/campaignsList/campaignsList";
import factory from "../ethereum/factory";
import { Button } from "semantic-ui-react";
import Layout from "../components/layout/layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

function index() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        getCampaigns();
    }, []);

    const getCampaigns = async () => {
        try {
            const getCampaigns = await factory.methods
                .getDeployedCampaigns()
                .call();
            const item = getCampaigns.map((address) => {
                return {
                    header: address,
                    description: (
                        <Link to={`/campaigns/${address}`}>
                            <a>view campaign</a>
                        </Link>
                    ),
                    fluid: true,
                };
            });
            setCampaigns(item);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Layout>
                <h3>Open Campaigns</h3>
                <Link to={"/campaigns/new"}>
                    <a>
                        <Button
                            floated="right"
                            primary
                            content="Create Campaign"
                            icon="add circle"
                        />
                    </a>
                </Link>
                <CampaignsList campaigns={campaigns} />
            </Layout>
        </div>
    );
}

export default index;
