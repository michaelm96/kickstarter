import React, { useEffect, useState } from "react";
import { Card } from "semantic-ui-react";

function CampaignsList({ campaigns }) {
    return (
        <>
            <div>
                <Card.Group items={campaigns} />
            </div>
        </>
    );
}

export default CampaignsList;
