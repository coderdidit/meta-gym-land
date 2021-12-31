import React, { useContext } from "react";
import { AvatarCtx } from "index";
import { Redirect } from "react-router";
import { Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BtnPrimary, BreakFlexDiv } from "../../GlobalStyles";
import { Row, Col } from 'antd';

const ColSpant = 12;

const PlaySetupPage = () => {
    const [avatar] = useContext(AvatarCtx);
    if (!avatar) {
        return <Redirect to="/avatars" />;
    }
    return (<>
        <Row
            style={{
                ...BreakFlexDiv,
                justifyContent: "center",
                marginBottom: "20rem",
                textAlign: "center"
            }}>
            <Col span={ColSpant} >
                <h1 style={{ fontFamily: "Source Serif Pro", }}>
                    avatar here...
                </h1>
            </Col>
            <Col span={ColSpant} >
                <div style={{
                    backgroundColor: "darkcyan",
                    height: "16rem",
                }}>
                    <h1 style={{ fontFamily: "Source Serif Pro", }}>
                        camera setup here...
                    </h1>
                </div>
            </Col>
        </Row>
        <div style={BreakFlexDiv}></div>
        <Row
            style={{
                ...BreakFlexDiv,
                justifyContent: "center",
                marginBottom: "5rem",
                textAlign: "center"
            }}>
            <Col span={ColSpant} >
                <Button
                    type="primary"
                    style={BtnPrimary}
                    onClick={() => window.history.back()}
                >
                    <LeftOutlined />Back
                </Button>
            </Col>
            <Col span={ColSpant} >
                <Button
                    style={{
                        ...BtnPrimary,
                        backgroundColor: "#20BF96",
                    }}
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
