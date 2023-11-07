function PermissionDeniedMessage() {
    return (
        <div className="grid m-4 place-items-center">
            <h1 className="w3-jumbo w3-animate-top w3-center text-2xl text-danger"><code>Access Denied</code></h1>
            <hr className="w3-border-white w3-animate-left m-auto w-1/2"/>
            <h3 className="w3-center w3-animate-right text-black-2">You do not have the required permissions to access this resource.</h3>
            <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
            <h6 className="w3-center w3-animate-zoom text-black-2">error code:403 forbidden</h6>
        </div>
    );
}

export default PermissionDeniedMessage;
