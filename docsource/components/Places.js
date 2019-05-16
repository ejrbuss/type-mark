import Link  from 'next/link';
import Vars  from '../Vars'; 

export default ({ home, api }) => (
    <>
        <Link href={Vars.sitePrefix + '/index'}><a className={`m-md ${home ? 'active' : ''}`}><i className='fas fa-home' />Home</a></Link>
        <Link href={Vars.sitePrefix + '/api'}><a className={`m-md ${api ? 'active' : ''}`}><i className='fas fa-book' />API</a></Link>
        <Link href='https://cdn.rawgit.com/ejrbuss/type-mark/b33a3d5646d5cf4d280ab97d73c776c5522dae90/type-mark.min.js'><a className='m-md'><i className='fas fa-cloud-download-alt' />Download</a></Link>
    </>
);