export default class VolumeSliderService {

    volumeMainContainer?: HTMLElement
    volumeContainer?: HTMLElement
    volumeHandle?: HTMLElement
    currentY: number
    allowMoving: boolean
    callbackFunction: (a: number) => void

    constructor(callback: (a: number) => void) {
        this.volumeMainContainer = null
        this.volumeContainer = null
        this.volumeHandle = null
        this.currentY = null
        this.allowMoving = false
        this.callbackFunction = callback
    }

    startHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        this.allowMoving = true
        this.currentY =  e.pageY - this.getAbsPos()
        const valToSet = Math.max(0, ((this.currentY / this.volumeContainer.offsetHeight) * 100))
        this.volumeHandle.style.top = valToSet.toString() + '%'
        document.getElementById('volume-text-display').textContent = Math.floor((100 - valToSet)).toString() + '%'
    }

    moveHandler =  (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.allowMoving) {
            return false
        }
        this.currentY =  e.pageY - this.getAbsPos()
        const valToSet = Math.max(0, ((this.currentY / this.volumeContainer.offsetHeight) * 100))
        this.volumeHandle.style.top = valToSet.toString() + '%'
        document.getElementById('volume-text-display').textContent = Math.floor((100 - valToSet)).toString() + '%'
    }

    getAbsPos = () => {
        // tslint:disable-next-line: max-line-length
        return this.volumeMainContainer.parentElement.offsetTop + this.volumeContainer.offsetTop + this.volumeContainer.offsetTop
    }

    endHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.allowMoving) {
            const valToReturn = 100 - ((this.currentY / this.volumeContainer.offsetHeight) * 100)
            this.callbackFunction(valToReturn)
        }
        this.allowMoving = false
    }

    updateElements = () => {
        this.volumeMainContainer = document.getElementById('volume-slider-container')
        this.volumeContainer = document.getElementById('volume-slider')
        this.volumeHandle = document.getElementById('volume-slider-handle')
    }
}