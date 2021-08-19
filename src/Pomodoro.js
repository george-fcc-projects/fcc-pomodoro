import logo from './logo.svg';
import './Pomodoro.css';
import {Component} from "react";
import { Card, CardTitle, CardText, Button, ButtonGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faPlay, faPause, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import beepSound from './beep.wav'


const BREAK = 'BREAK';
const SESSION = 'SESSION';

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'


function secsToMins(seconds, displaySeconds, timer=false) {
    let secs = (seconds % 60).toString();
    let mins = Math.trunc(seconds/60).toString();

    switch (timer) {
        case true:
            if (mins.length === 1) {
                mins = '0' + mins;
            }
            break;
    }

    if (secs.length === 1) {
        secs = '0' + secs;
    }

    if (displaySeconds) {
        return `${mins}:${secs}`
    } else {
        return mins
    }

}


class Pomodoro extends Component {
    constructor(props) {
        super(props);

        this.breakChange = this.breakChange.bind(this);
        this.startStop = this.startStop.bind(this);
        this.runTimer = this.runTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.decrementTime = this.decrementTime.bind(this);
        this.reset = this.reset.bind(this);
        this.switchModes = this.switchModes.bind(this);

    }


    state = {
        breakLength: 300,
        sessionLength: 1500,
        currentType: SESSION,
        currentTime: 1500,
        running: false,
        intervalID: 0
    }




    breakChange(event) {
        console.log(event);
        switch (event.target.getAttribute('data-changing')) {
            case 'break':
                switch (event.target.getAttribute('data-changetype')) {
                    case INCREMENT:
                        if (this.state.breakLength === 3600) {
                            break;
                        } else {
                            this.setState((state) => ({
                                breakLength: state.breakLength + 60
                            }));
                            break;
                        }
                    case DECREMENT:
                        if (this.state.breakLength === 60) {
                            break;
                        } else {
                            this.setState((state) => ({
                                breakLength: state.breakLength - 60
                            }));
                            break;
                        }

                }
                break;
            case 'session':
                switch (event.target.getAttribute('data-changetype')) {
                    case INCREMENT:
                        if (this.state.sessionLength === 3600) {
                            break;
                        } else {
                            this.setState((state) => ({
                                sessionLength: state.sessionLength + 60,
                                currentTime: state.currentTime + 60
                            }));
                            break;
                        }
                    case DECREMENT:
                        if (this.state.sessionLength === 60) {
                            break;
                        } else {
                            this.setState((state) => ({
                                sessionLength: state.sessionLength - 60,
                                currentTime: state.currentTime - 60
                            }));
                            break;
                        }


                }
                break;
        }





    }

    startStop() {
        console.log('start stop');
        this.setState((state) => ({
            running: !state.running
        }), function () {
            console.log(this.state.running);
            if (this.state.running) {
                this.runTimer();
            } else {
                this.pauseTimer();
            }
        })
    }

    runTimer() {
        console.log('starting timer');
        let timerID = setInterval(this.decrementTime, 1000)
        this.setState((state) => ({
            intervalID: timerID
        }), function () {
            console.log('timer started', this.state.intervalID)
        })
    }

    pauseTimer() {
        console.log('stopping timer', this.state.intervalID);
        clearInterval(this.state.intervalID);
        this.setState((state) => ({
            running: false
        }))
    }

    decrementTime() {
        if (this.state.currentTime > 0) {
            this.setState((state) => ({
                currentTime: state.currentTime -1
            }))
        } else {
            this.switchModes();
        }
    }

    switchModes() {
        this.playBeep();
        switch (this.state.currentType) {
            case SESSION:
                this.setState((state) => ({
                    currentType: BREAK,
                    currentTime: state.breakLength
                }))
                break;
            case BREAK:
                this.setState((state) => ({
                    currentType: SESSION,
                    currentTime: state.sessionLength
                }))
                break;

        }
    }

    reset() {
        this.stopBeep();
        this.pauseTimer();
        this.setState((state) => ({
            breakLength: 300,
            sessionLength: 1500,
            currentType: SESSION,
            currentTime: 1500,
            running: false,
            intervalID: 0
        }))
    }

    playBeep() {
        document.getElementById('beep').play();
    }

    stopBeep() {
        document.getElementById('beep').pause();
        document.getElementById('beep').currentTime = 0;

    }





    render() {
    return (
        <div className="App">
          <Header/>
          <TimerContainer
              breakLength={this.state.breakLength}
              sessionLength={this.state.sessionLength}
              currentType={this.state.currentType}
              currentTime={this.state.currentTime}
              breakChanger={this.breakChange}
              startStop={this.startStop}
              running={this.state.running}
              reset={this.reset}
              playBeep={this.playBeep}
          />
        </div>
    );
    }
}



class Header extends Component {
    render() {
        return (
            <div className='App-header'>
               Pomodoro Timer
            </div>
        );
    }
}

class TimerContainer extends Component {
    render() {
        return (
            <div className='timer-container'>
                <TimerSettings
                    breakLength={this.props.breakLength}
                    sessionLength={this.props.sessionLength}
                    breakChanger={this.props.breakChanger}
                    running={this.props.running}
                />
                <TimerCountdown
                    currentTime={this.props.currentTime}
                    currentState={this.props.currentType}
                />
                <TimerControls
                    startStop={this.props.startStop}
                    reset={this.props.reset}
                />
                <Beeper
                    playBeep={this.props.playBeep}
                />
            </div>
        );
    }
}


class Beeper extends Component {

    constructor(props) {
        super(props);
        this.beepPlayer = new Audio(beepSound);
        this.beepPlayer.id = 'beep2'
        this.play = this.play.bind(this);



    }

    play() {
        // this.beepPlayer.play();
        document.getElementById('beep').play();
        console.log('playing');
    }

    render() {
        return (
            <div>
                <audio src={beepSound} id='beep'/>
            </div>
        );
    }
}


class TimerSettings extends Component {
    render() {
        return (
            <div className='timer-settings'>
                <SettingDiv
                    title='Break Length'
                    content={secsToMins(this.props.breakLength, false)}
                    changer={this.props.breakChanger}
                    settingsFor='break'
                    running={this.props.running}
                />
                <SettingDiv
                    title='Session Length'
                    content={secsToMins(this.props.sessionLength, false)}
                    changer={this.props.breakChanger}
                    settingsFor='session'
                    running={this.props.running}
                />

            </div>
        );
    }
}

class SettingDiv extends Component {
    render() {
        return (
            <div className='setting-div'>
                <h5 id={`${this.props.settingsFor}-label`}>
                    {this.props.title}
                </h5>
                <p id={`${this.props.settingsFor}-length`}>
                    {this.props.content}
                </p>
                <ControlButtons
                    changer={this.props.changer}
                    buttonsFor={this.props.settingsFor}
                    running={this.props.running}
                />
            </div>
        );
    }
}


class ControlButtons extends Component {
    render() {
        return (
            <ButtonGroup className='button-wrapper'>
                <Button
                    id={`${this.props.buttonsFor}-increment`}
                    color='primary'
                    onClick={this.props.changer}
                    data-changetype={INCREMENT}
                    data-changing={this.props.buttonsFor}
                    disabled={this.props.running}
                >
                    <FontAwesomeIcon icon={faArrowUp}/>
                </Button>
                <Button
                    id={`${this.props.buttonsFor}-decrement`}
                    color='primary'
                    onClick={this.props.changer}
                    data-changetype={DECREMENT}
                    data-changing={this.props.buttonsFor}
                    disabled={this.props.running}
                >
                    <FontAwesomeIcon icon={faArrowDown}/>
                </Button>
            </ButtonGroup>
        );
    }
}


class TimerCountdown extends Component {
    render() {
        return (
            <div>
                <h1 id='timer-label'>
                    {this.props.currentState}
                </h1>
                <h3 id='time-left'>
                    {secsToMins(this.props.currentTime, true, true)}
                </h3>
            </div>
        );
    }
}

class TimerControls extends Component {
    render() {
        return (
            <div className='timer-control-wrapper'>
                <ButtonGroup>
                    <Button
                        color='success'
                        id='start_stop'
                        onClick={this.props.startStop}>
                        <FontAwesomeIcon icon={faPlay}/>
                        <FontAwesomeIcon icon={faPause}/>
                    </Button>
                    <Button color='danger'
                            id='reset'
                            onClick={this.props.reset}>
                        <FontAwesomeIcon icon={faSyncAlt}/>
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default Pomodoro;
