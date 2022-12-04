import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="button-container">
                    <a href="https://github.com/JohnLanni619" target="_blank" rel='noreferrer'>
                        <FaGithub aria-hidden="true" />
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/johnlanni619/" target="_blank" rel='noreferrer'>
                        <FaLinkedin aria-hidden="true" />
                        LinkedIn
                    </a>
                </div>
                <p>&copy; John Lanni 2022</p>                
            </div>
        </footer>
    )
}