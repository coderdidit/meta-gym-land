/* eslint-disable react-hooks/exhaustive-deps */
import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React, { useEffect, useMemo } from "react";

export default function ContractResolver({ contract, setContract }) {
  useEffect(() => {
    /** Tries to load local contract JSON file or get
     * it from browser localStorage(works only if file was uploaded previosly by drag&drop component) */
    let localContract;
    try {
      localContract = {};
      // commenting to avoid warrning
      // require("contracts/contractInfo.json");
    } catch {
      localContract = JSON.parse(window.localStorage.getItem("contract"));
    }

    if (localContract) {
      setContract(localContract);
    } else {
      message.error("No contract found. Upload it manually or deploy the contract again");
    }
  }, []);

  // Props for drag and drop uploader
  const uploadProps = useMemo(() => {
    return {
      name: "file",
      accept: ".JSON",
      multiple: false,
      maxCount: 1,
      fileList: contract?.contractName ? [{ name: `${contract?.contractName}.json`, contract }] : [],
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
      },
      onRemove() {
        setContract();
        window.localStorage.removeItem("contract");
      },
      beforeUpload: (file) => {
        async function fileToJSON(file) {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsText(file);
          });
        }
        fileToJSON(file).then((resolvedContract) => {
          window.localStorage.setItem("contract", JSON.stringify(resolvedContract));
          setContract(resolvedContract);
        });
        return false;
      },
    };
  }, [contract]);

  return (
    <Dragger {...uploadProps}>
      {!contract && (
        <>
          {" "}
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Contract file to this area to upload</p>
          <p className="ant-upload-hint">
            Supports JSON Contract data generated by Truffle and HardHat. JSON File should contain ABI, address and contract name
          </p>
        </>
      )}
    </Dragger>
  );
}
