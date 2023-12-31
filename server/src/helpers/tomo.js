const Web3Util = require('./web3')
const BlockSignerABI = require('../contracts/abi/BlockSigner')
const contractAddress = require('../contracts/contractAddress')
const StrmValidatorABI = require('../contracts/abi/StrmValidator')
const logger = require('./logger')

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

const blockSigner = {
    getBlockSignerContract: async () => {
        const web3 = await Web3Util.getWeb3()
        return new web3.eth.Contract(BlockSignerABI, contractAddress.BlockSigner)
    },
    getSigners: async (blockHash) => {
        const bs = await blockSigner.getBlockSignerContract()
        return bs.methods.getSigners(blockHash).call().catch(e => {
            logger.warn('Cannot get signer of block %s. Sleep 2 seconds and try more', blockHash)
            return sleep(2000).then(() => {
                return blockSigner.getSigners(blockHash)
            })
        })
    }
}
const strmValidator = {
    getValidatorContract: async () => {
        const web3 = await Web3Util.getWeb3()
        return new web3.eth.Contract(StrmValidatorABI, contractAddress.StrmValidator)
    },
    getValidatorContractWs: async () => {
        const web3 = await Web3Util.getWeb3Socket()
        return new web3.eth.Contract(StrmValidatorABI, contractAddress.StrmValidator)
    },
    getCandidateOwner: async (candidate) => {
        const tc = await strmValidator.getValidatorContract()
        return tc.methods.getCandidateOwner(candidate).call().catch(e => {
            logger.warn('cannot get owner of candidate %s. Sleep 2 seconds and try more', candidate)
            return sleep(2000).then(() => {
                return strmValidator.getCandidateOwner(candidate)
            })
        })
    },
    getVoterCapacity: async (candidate, voter) => {
        const tc = await strmValidator.getValidatorContract()
        return tc.methods.getVoterCap(candidate, voter).call().catch(e => {
            logger.warn('cannot get owner of candidate %s. Sleep 2 seconds and try more', candidate)
            return sleep(2000).then(() => {
                return strmValidator.getVoterCapacity(candidate, voter)
            })
        })
    }
}

module.exports = { blockSigner, strmValidator }
