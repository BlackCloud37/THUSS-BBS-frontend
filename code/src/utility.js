let scrollToTop = () => {
    const drag = 1
    const gap = document.documentElement.scrollTop || document.body.scrollTop
    if ( gap > 0 ) {
        window.requestAnimationFrame(scrollToTop)
        window.scrollTo(0, gap - gap / drag)
    }
}

let monthDay = (dateStr) => {
    let date = new Date(Date.parse(dateStr))
    return date.getMonth()+1 + '-' + date.getDate()
}

let hourMin = (dateStr) => {
    let date = new Date(Date.parse(dateStr))
    return date.getHours() + ':' + date.getMinutes()
}
export { scrollToTop, monthDay, hourMin}