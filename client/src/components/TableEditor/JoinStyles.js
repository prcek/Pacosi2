function JoinStyles(arr) {
    if (arr.length===0) {
        return (theme)=>{return {}};
    } else {
        let first = arr[0];
        let ra = Array.from(arr);
        ra.shift();
        let rest = JoinStyles(ra);
        return (theme) =>{
            let base = first(theme);
            let ress = rest(theme);
            return Object.assign(base,ress);
        };
    }
}

export default JoinStyles;