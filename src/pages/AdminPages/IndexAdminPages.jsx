import React, { useEffect } from "react";
import { Indexadmin } from "../../componen/admin/Indexadmin";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../fitur/AuthSlice";

export const IndexAdminPages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
  
    useEffect(() => {
      dispatch(getMe());
    }, [dispatch]);
  
    useEffect(() => {
      if (isError) {
        navigate("/");
      }
    }, [isError, navigate]);
  return (
   <Layout>
    <Indexadmin />
   </Layout>
  )
}
