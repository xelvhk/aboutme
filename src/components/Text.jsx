import Typewriter from "typewriter-effect";
import "../styles/style.css";


function Text() {
    const strings = ["Frontend", "Python", "Aiogram"];
    
    return (
        <Typewriter
            options={{
                strings: strings,
                autoStart: true,
                loop: true,
                deleteSpeed: 30,
                wrapperClassName: 'typewriter-wrapper'
            }}
            onError={(error) => {
                console.warn('Typewriter error:', error);
            }}
        />
    );
}

export default Text;