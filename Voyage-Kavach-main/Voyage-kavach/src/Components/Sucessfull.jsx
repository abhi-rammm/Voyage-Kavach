import React from 'react'

const Sucessfull = () => {
  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.circle}>
          <i style={styles.checkmark}>✓</i>
        </div>
        <h1 style={styles.h1}>Success</h1>
        <p style={styles.p}>
          We received your purchase request;
          <br /> we'll be in touch shortly!
        </p>
      </div>
    </div>
  );
};

const styles = {
  body: {
    paddingTop:"30px",
    textAlign: "center",
    padding: "40px 0",
    backgroundColor: "#EBF0F5",
    height: "100vh", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    color: "#88B04B",
    fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
    fontWeight: 900,
    fontSize: "40px",
    marginBottom: "10px",
  },
  p: {
    color: "#404F5E",
    fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
    fontSize: "20px",
    margin: 0,
  },
  checkmark: {
    color: "#9ABC66",
    fontSize: "100px",
    lineHeight: "200px",
    marginLeft: "-15px",
  },
  card: {
    backgroundColor: "white",
    padding: "60px",
    borderRadius: "4px",
    boxShadow: "0 2px 3px #C8D0D8",
    display: "inline-block",
    textAlign: "center",
  },
  circle: {
    borderRadius: "200px",
    height: "200px",
    width: "200px",
    backgroundColor: "#F8FAF5",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Sucessfull;

