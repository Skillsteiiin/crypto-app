import React, { useEffect, useState } from "react";
import { Layout, Select, Space, Button, Modal, Drawer, Typography } from "antd";
import { useCrypto } from "../../Context/Crypto-context";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";

const { Text } = Typography;

const headerStyle = {
    width: "100%",
    textAlign: "center",
    height: 60,
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const AppHeader = () => {
    const [select, setSelect] = useState(false);
    const [modal, setModal] = useState(false);
    const [coin, setCoin] = useState(null);
    const [drawer, setDrawer] = useState(false);
    const { crypto, user, logout } = useCrypto();

    useEffect(() => {
        const keypress = (e) => {
            if (e.key === "/") {
                setSelect((prev) => !prev);
            } else if (e.key === "Escape") {
                setSelect(false);
            }
        };
        document.addEventListener("keypress", keypress);
        return () => document.removeEventListener("keypress", keypress);
    }, []);

    const handleSelect = (value) => {
        setCoin(crypto.find((c) => c.id === value));
        setModal(true);
    };

    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{
                    width: 250,
                }}
                open={select}
                onSelect={handleSelect}
                onClick={() => setSelect((prev) => !prev)}
                value="press / to open"
                options={crypto.map((coin) => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img
                            style={{ width: 20 }}
                            src={option.data.icon}
                            alt={option.data.label}
                        />{" "}
                        {option.data.label}
                    </Space>
                )}
            />

            <Space>
                {user && (
                    <Text strong style={{ color: "white" }}>
                        Привет, {user.name}
                    </Text>
                )}

                <Button type="primary" onClick={() => setDrawer(true)}>
                    Add Asset
                </Button>

                <Button danger onClick={logout}>
                    Выйти
                </Button>
            </Space>

            <Modal
                open={modal}
                onOk={() => setModal(false)}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <CoinInfoModal coin={coin} />
            </Modal>

            <Drawer
                width={600}
                title="Add Asset"
                onClose={() => setDrawer(false)}
                open={drawer}
                destroyOnClose
            >
                <AddAssetForm onClose={() => setDrawer(false)} />
            </Drawer>
        </Layout.Header>
    );
};

export default AppHeader;
