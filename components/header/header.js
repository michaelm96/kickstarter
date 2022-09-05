import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../../routes";

function Header() {
    return (
        <Menu style={{ marginTop: "10px" }}>
            <Link route={"/"}>
                <a className="item">CrowdCoin</a>
            </Link>

            <Menu.Menu position="right">
                <Menu.Item
                    name="campaigns"
                    // active={activeItem === "signup"}
                    // onClick={this.handleItemClick}
                >
                    Campaigns
                </Menu.Item>
                <Link route={"/campaigns/new"}>
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;
