import React, { useContext } from "react";
import { AvatarCtx } from "index";
import { Redirect } from "react-router";
import { Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BreakFlexDiv, BtnPrimary } from "../../GlobalStyles";
import { Row, Col } from 'antd';

const PlaySetupPage = () => {
    const [avatar] = useContext(AvatarCtx);
    if (!avatar) {
        return <Redirect to="/avatars" />;
    }
    return (<>
        <Row style={{
            fontFamily: "Source Serif Pro",
            flexBasis: "100%",
            height: "0",
            justifyContent: "center",
            marginTop: "6rem",
        }}>
            <Col span={100} style={{
                textAlign: "center",
            }}>
                <h1>
                    camera setup here...
                </h1>
            </Col>
        </Row>
        <Row style={{
            fontFamily: "Source Serif Pro",
            flexBasis: "100%",
            height: "0",
            justifyContent: "center",
            marginTop: "12rem",
            marginBottom: "10rem"
        }}>
            <Col span={100} style={{
                textAlign: "center"
            }}>
                <Button
                    type="primary"
                    style={BtnPrimary}
                    onClick={() => window.history.back()}
                >
                    <LeftOutlined />Back
                </Button>

                <Button
                    type="link"
                    style={BtnPrimary}
                >
                    <Link to='/play'>
                        Join MetaGymLand <RightOutlined />
                    </Link>
                </Button>
            </Col>
        </Row>
    </>);
}

export default PlaySetupPage;
