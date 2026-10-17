import { FadeLoader } from 'react-spinners'

const Loader = ({ size = 70, fullScreen = true }) => {
    return (
        <div className={fullScreen ? 'loader loader-fullscreen' : 'loader loader-inline'}>
            <FadeLoader
                color="#2b5344"
                height={size}
                width={size / 5}
                radius={2}
                margin={2}
            />
        </div>
    )
}

export default Loader