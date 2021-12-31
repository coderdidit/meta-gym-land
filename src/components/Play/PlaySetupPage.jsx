import React, { useContext } from "react";
import { AvatarCtx } from "index";
import { Redirect } from "react-router";
import { Card, Button, Typography } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BtnPrimary, BreakFlexDiv } from "../../GlobalStyles";
import { Row, Col } from 'antd';
import { brightFontCol } from "../../GlobalStyles";

const { Text } = Typography;

const styles = {
    card: {
        border: "none",
        borderBottom: "none",
        background: "none",
        color: brightFontCol,
        lineHeight: "1.4",
    },
    btnDiv: {
        display: "flex",
        marginTop: "5rem",
    }
};

const PlaySetupPage = () => {
    const [avatar] = useContext(AvatarCtx);
    if (!avatar) {
        return <Redirect to="/avatars" />;
    }
    return (<>
        <Card style={styles.card}>
            <div>
                <div style={{
                    backgroundColor: "chocolate",
                    width: "15rem",
                    height: "15rem",
                    padding: "15rem",
                }}>
                    <h1 style={{ fontFamily: "Source Serif Pro", }}>
                        avatar here...
                    </h1>
                </div>
                <div
                    style={{
                        ...styles.btnDiv,
                        justifyContent: "left",
                    }}
                >
                    <Button
                        type="primary"
                        style={BtnPrimary}
                        onClick={() => window.history.back()}
                    >
                        <LeftOutlined />Back
                    </Button>
                </div>
            </div>
        </Card>
        <Card style={styles.card} >
            <div style={{
                backgroundColor: "darkcyan",
            }}>
                <h1 style={{
                    fontFamily: "Source Serif Pro",
                    width: "15rem",
                    height: "15rem",
                    padding: "15rem",
                }}>
                    camera setup here...
                </h1>
            </div>
            <div
                style={{
                    ...styles.btnDiv,
                    justifyContent: "right",
                }}
            >
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
            </div>
        </Card>
    </>);
}

export default PlaySetupPage;
