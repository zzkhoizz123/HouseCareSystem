
function ConvertDate(d){
    const parts = d.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

export default ConvertDate;
