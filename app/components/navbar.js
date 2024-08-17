"use client";

import React from "react";
import "../styles/navbar.css";
import { useUser } from "@clerk/nextjs";
import premium from "../images/premium-user.png";
import regular from "../images/regular-user.png";
import Image from "next/image.js";
function Navbar() {
  const { user } = useUser();
  console.log(user);
  return (
    <nav>
      <a href="/" className="logo">
        AI FLASHCARDS
      </a>

      {user ? (
        <div className="loggedin-user">
          <div className="name">
            <Image
              alt="avatar"
              style={{ background: "white", borderRadius: "100%" }}
              height={25}
              width={25}
              src={premium}
            />
            {user.firstName ||
              user.primaryEmailAddress.emailAddress.split("@")[0]}
          </div>
          <a href="generate" className="create">
            Create
          </a>
          <a href="myflashcards" className="my-flashcards">
            My Flashcards
          </a>
        </div>
      ) : (
        <div className="buttons">
          <a href="sign-in">Sign In</a>
          <a href="sign-up">Sign Up</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
