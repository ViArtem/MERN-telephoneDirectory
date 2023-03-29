import React, { useState, useEffect } from "react";
import jwt from "jwt-decode";
import MyButton from "./UI/button/MyButton";
import Photo from "./UI/photo/Photo";
import axios from "axios";
const FoundBlock = ({
  styleClass,
  foundContactHttp,
  editModal,
  editModalValue,
  deletes,
  socket,
  setupdatingList,
}) => {
  let className = "otherBlock ";
  const [userData, setUserData] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [httpImg, setHttpImg] = useState("");
  if (styleClass) {
    className += styleClass;
  }

  useEffect(() => {
    if (foundContactHttp) {
      try {
        setDeleteUser({
          fullName: foundContactHttp.data.fullName,
          action: "Delete",
          imgPath: foundContactHttp.data.avatar,
          userId: jwt(localStorage.getItem("Authorization")).id,
          userRole: jwt(localStorage.getItem("Authorization")).role,
        });
        if (foundContactHttp.data.number) {
          if (
            jwt(localStorage.getItem("Authorization")).id ==
              foundContactHttp.data.owner ||
            jwt(localStorage.getItem("Authorization")).role == "admin"
          ) {
            setHttpImg(foundContactHttp.data.avatar);
            setShowButton(true);
          } else setShowButton(false);
          setUserNumber(foundContactHttp.data.number);

          return setUserData(foundContactHttp.data.fullName);
        }
      } catch (error) {
        if (foundContactHttp.success == "The value cannot be empty") {
          setShowButton(false);
          setUserNumber(false);
          return setUserData("The value cannot be empty");
        }

        if (foundContactHttp.success == "Contact no found") {
          setShowButton(false);
          return setUserData("No found");
        }
      }
    }
  }, [foundContactHttp]);

  const [deleteUserDataSocket, setdeleteUserDataSocket] = useState("");
  // information about the found user
  const [foundUserDataSocket, setfoundUserDataSocket] = useState("");
  const [foundUserNumberSocket, setfoundUserNumberSocket] = useState("");
  const [allUserSocketData, setAllUserSocketData] = useState("");
  const [showSocketButton, setShowSocketButton] = useState(false);
  const [socketImg, setSocketImg] = useState("");

  async function ButtonDelete(e) {
    try {
      e.preventDefault();
      if (socket) {
        socket.emit("delete user value", {
          fullName: deleteUserDataSocket,
          ownerId: jwt(localStorage.getItem("Authorization")).id,
          userRole: jwt(localStorage.getItem("Authorization")).role,
        });
        // updates the list of users at the click of a button

        setfoundUserDataSocket("");
        setfoundUserNumberSocket("");
        setShowSocketButton(false);
      } else {
        const response = await axios.delete("/contact/delete", {
          data: deleteUser,
        });
        foundContactHttp = null;
        setUserNumber("");
        deletes(response);
        setShowButton(false);
        setUserData("");
        setupdatingList(Math.random());
      }
    } catch (error) {
      console.log(error);
    }
  }

  function ButtonEdit() {
    // socket edit modal
    if (socket && editModal) {
      editModal(true);
      setShowSocketButton(false);
      setfoundUserDataSocket("");
      setfoundUserNumberSocket("");
      setupdatingList(Math.random() + Math.random());
      return editModalValue({
        fullName: allUserSocketData.fullName,
        number: allUserSocketData.number,
        id: allUserSocketData._id,
        socket: true,
      });
    }
    //http edit modal
    if ((editModal && foundContactHttp) || editModalValue) {
      editModal(true);
      foundContactHttp.data.avatar = "";
      setShowButton(false);
      setUserData("");
      setUserNumber("");
      editModalValue({
        fullName: foundContactHttp.data.fullName,
        number: foundContactHttp.data.number,
        id: foundContactHttp.data._id,
      });
      setupdatingList(Math.random());
    }
  }

  //socket
  // display of the found user
  if (socket) {
    socket.on("findOne user", (data) => {
      console.log(data);
      if (
        data.userFirstName == "User not found" ||
        data.userFirstName == "The value cannot be empty"
      ) {
        setfoundUserNumberSocket("");
        setfoundUserDataSocket(data.userFirstName);
        setShowSocketButton(false);
      } else {
        setSocketImg(data.foundData.avatar);
        setfoundUserDataSocket(`${data.foundData.fullName}`);
        setfoundUserNumberSocket(`${data.foundData.number}`);
        //
        setdeleteUserDataSocket(`${data.foundData.fullName}`);
        setAllUserSocketData(data.foundData);
        //
        if (
          jwt(localStorage.getItem("Authorization")).id ==
            data.foundData.owner ||
          jwt(localStorage.getItem("Authorization")).role == "admin"
        ) {
          setShowSocketButton(true);
        } else setShowSocketButton(false);
      }
    });
  }

  return (
    <div style={{ height: "232px" }} className={className}>
      <h1
        style={{
          marginBottom: "20px",
          display: "inline-block",
          fontSize: "22px",
          width: "100%",
        }}
      >
        FOUND CONTACT
      </h1>
      <div className="container" style={{ gap: "2px" }}>
        {foundUserNumberSocket ? (
          <Photo>
            <img
              style={{
                with: "75px",
                height: " 75px",
                marginRight: "auto",
                marginLeft: "auto",
              }}
              src={socketImg}
              alt="Foto"
            />
          </Photo>
        ) : (
          ""
        )}

        {foundUserDataSocket ? (
          <p>
            {foundUserDataSocket} {foundUserNumberSocket}
          </p>
        ) : (
          ""
        )}

        {userNumber ? (
          <Photo>
            <img
              style={{
                with: "75px",
                height: " 75px",
                marginRight: "auto",
                marginLeft: "auto",
              }}
              src={httpImg}
              alt="Foto"
            />
          </Photo>
        ) : (
          " "
        )}

        {foundContactHttp ? (
          <p>
            {userData} {userNumber}
          </p>
        ) : (
          ""
        )}
      </div>

      <div>
        {showButton ? (
          <MyButton onClick={ButtonEdit} style={{ marginTop: "10px" }}>
            Edit
          </MyButton>
        ) : (
          ""
        )}

        {showButton ? (
          <MyButton
            onClick={ButtonDelete}
            style={{
              marginTop: "10px",
              marginLeft: "5px",
              border: " 1px solid rgb(255, 150, 200)",
            }}
          >
            Delete
          </MyButton>
        ) : (
          ""
        )}
      </div>

      <div>
        {showSocketButton ? (
          <MyButton onClick={ButtonEdit} style={{ marginTop: "10px" }}>
            Edit
          </MyButton>
        ) : (
          ""
        )}

        {showSocketButton ? (
          <MyButton
            onClick={ButtonDelete}
            style={{
              marginTop: "10px",
              marginLeft: "5px",
              border: " 1px solid rgb(255, 150, 200)",
            }}
          >
            Delete
          </MyButton>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FoundBlock;