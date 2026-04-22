function Pre(props) {
  if (props.load === undefined) {
    return null;
  }
  
  return (
    <div 
      id={props.load ? "preloader" : "preloader-none"}
      role="status"
      aria-label={props.load ? "Loading..." : "Loaded"}
    />
  );
}

export default Pre;