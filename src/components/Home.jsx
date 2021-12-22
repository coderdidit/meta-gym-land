import { Card, Typography } from "antd";
import React from "react";
import { Button } from 'antd';
import { Row, Col } from 'antd';
const { Text } = Typography;

const styles = {
  titleText: {
    fontSize: "36px",
    justifyContent: "center",
  },
  text: {
    fontSize: "18px",
    justifyContent: "center",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  btn: {
    height: "fit-content",
    display: "flex",
    justifyContent: "space-between",
    verticalAlign: "center",
    borderRadius: "0.6rem",
    fontWeight: "500",
    fontSize: "18px",
  }
};

export default function Home() {
  return (
    <Row>
      <Col span={24}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Card
            style={styles.card}
            title={
              <>
                <Text strong style={styles.titleText}>
                  Gamify daily stretches<br />
                  with AI and blockchain
                </Text>
              </>
            }
          >
            <Text style={styles.text}>
              Have fun and get fit!
            </Text>
            <br /><br />
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "0.1rem",
              }}
            >
              <Button
                onClick={() => alert('will play')}
                type="primary"
                style={styles.btn}
              >Play now</Button>
              <Button
                href="https://coderdidit.com"
                target="_blank"
                type="default"
                style={styles.btn}
              >Whitepaper</Button>
            </div>
          </Card>
          <Card
            style={styles.card}
            title={
              <Text style={styles.text}>
                Example of Gamifying Stretches:
              </Text>
            }
          >
            <div>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/y-SmsMRFeEc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  );
}
