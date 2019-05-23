export default class ProgressBarService {

    progressContainer?: HTMLElement
    progressBar?: HTMLElement
    currentX?: number
    allowMoving: boolean
    callbackFunction: (a: number) => void

    constructor(callback: (a: number) => void) {
        this.progressContainer = null
        this.progressBar = null
        this.currentX = null
        this.allowMoving = false
        this.callbackFunction = callback
    }

    startHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        this.allowMoving = true
        this.currentX =  e.pageX
        this.progressBar.style.width = ((this.currentX / window.innerWidth) * 100 ).toString() + '%'
    }

    moveHandler =  (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.allowMoving) {
            return false
        }
        this.currentX =  e.pageX
        this.progressBar.style.width = ((this.currentX / window.innerWidth) * 100 ).toString() + '%'
    }

    endHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.allowMoving) {
            this.callbackFunction(this.currentX / window.innerWidth)
        }
        this.allowMoving = false
    }

    updateElements = () => {
        this.progressContainer = document.getElementById('progress-bar')
        this.progressBar = document.getElementById('progress-inner')
    }
}