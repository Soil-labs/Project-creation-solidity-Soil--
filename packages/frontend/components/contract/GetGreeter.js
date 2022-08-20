import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider } from 'wagmi';
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import contracts from '../../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../../config';

export const GetGreeter = () => {
  const chainId = Number(NETWORK_ID);
  const [currentAddress, setCurrentAddress] = useState();
  const [numberOfProjects, setNumberOfProjects] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //onst provider = useProvider();
  const { data: signerData } = useSigner();
  const allContracts = contracts;
  const greeterAddress = allContracts[chainId][0].contracts.ProjectFactory.address;
  const greeterABI = allContracts[chainId][0].contracts.ProjectFactory.abi;
  //const { data: accountData } = useAccount();
  const greeterContract = useContract({
    addressOrName: greeterAddress,
    contractInterface: greeterABI,
    signerOrProvider: signerData,
  });

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const fetchData = useCallback(async () => {
    try {
      //console.log(provider)
      const _numberOfProjects = await greeterContract.numberOfProjects(address);
      setNumberOfProjects(_numberOfProjects);
      
      setError('');
      //await getProjects()
      console.log(projects)
    } catch (error) {
      console.log(error)
      setError("Contract couldn't be fetched.  Please check your network.");
    }
    setLoading(false);
  }, [greeterContract]);


  useEffect(() => {
    if (signerData && address) {
      fetchData();
      
    }
  }, [signerData, greeterContract, fetchData]);
  if(!isConnected){
    return <button onClick={() => connect()}>Connect Wallet</button>
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ margin: '20px' }}>
      <span>Number of Projects : {String(numberOfProjects)}</span>
      <button style={{ marginLeft: '20px' }} onClick={() => fetchData()}>
        refresh
      </button>
    </div>
  );
};
