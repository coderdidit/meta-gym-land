import Loader from "./Loader";

const LoaderTest = () => {
    return (
        <Loader
            style={{
                position: "absolute",
                zIndex: "1",
                paddingTop: "20%",
                paddingLeft: "50%",
                background: "rgba(0, 0, 0, 0.09)",
                width: "100%",
                height: "100%",
            }}
        />
    );
}

export default LoaderTest;
