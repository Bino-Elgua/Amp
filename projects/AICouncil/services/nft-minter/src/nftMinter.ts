/**
 * Sui NFT Minter Service
 * Task 12: Mint disagreement severity as on-chain NFTs
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface DisagreementNFT {
  sessionId: string;
  topic: string;
  consensusScore: number;
  disagreementSeverity: number;
  agentCount: number;
  timestamp: string;
  chairmanSummary: string;
}

interface MintResult {
  objectId: string;
  txDigest: string;
  status: 'pending' | 'confirmed' | 'failed';
  nftAddress: string;
}

class SuiNFTMinter {
  private client: SuiClient;
  private keypair: Ed25519Keypair;
  private network: 'testnet' | 'mainnet';
  private packageId: string;

  constructor() {
    this.network = (process.env.SUI_NETWORK as any) || 'testnet';
    this.packageId = process.env.SUI_PACKAGE_ID || '';

    // Initialize Sui client
    const rpcUrl = this.network === 'testnet'
      ? getFullnodeUrl('testnet')
      : getFullnodeUrl('mainnet');

    this.client = new SuiClient({ url: rpcUrl });

    // Initialize keypair from environment
    const mnemonicOrKey = process.env.SUI_ADMIN_MNEMONIC || '';
    this.keypair = Ed25519Keypair.fromSecretKey(
      Buffer.from(mnemonicOrKey, 'hex')
    );
  }

  /**
   * Mint NFT for high disagreement council session
   */
  async mintDisagreementNFT(
    nftData: DisagreementNFT
  ): Promise<MintResult | null> {
    try {
      // Only mint if disagreement severity is high
      if (nftData.disagreementSeverity < 0.6) {
        console.log('Disagreement severity too low for NFT');
        return null;
      }

      // Create transaction
      const tx = new TransactionBlock();

      // TODO: Phase 3 - Implement actual Sui Move contract interaction
      // For now, return mock mint result

      const mockObjectId = `0x${Math.random()
        .toString(16)
        .slice(2)}`;
      const mockTxDigest = `${Math.random()
        .toString(16)
        .slice(2)}${Math.random()
        .toString(16)
        .slice(2)}`;

      return {
        objectId: mockObjectId,
        txDigest: mockTxDigest,
        status: 'pending',
        nftAddress: `https://explorer.sui.io/object/${mockObjectId}?network=${this.network}`,
      };

    } catch (error) {
      console.error('Error minting NFT:', error);
      return null;
    }
  }

  /**
   * Get NFT metadata
   */
  async getNFTMetadata(objectId: string) {
    try {
      const object = await this.client.getObject({
        id: objectId,
        options: {
          showType: true,
          showContent: true,
          showOwner: true,
        },
      });

      return object;

    } catch (error) {
      console.error('Error fetching NFT:', error);
      return null;
    }
  }

  /**
   * Verify NFT ownership
   */
  async verifyNFTOwnership(
    nftId: string,
    userAddress: string
  ): Promise<boolean> {
    try {
      const object = await this.client.getObject({
        id: nftId,
        options: { showOwner: true },
      });

      const owner = (object.data?.owner as any)?.AddressOwner;
      return owner === userAddress;

    } catch {
      return false;
    }
  }

  /**
   * Get user's NFTs
   */
  async getUserNFTs(userAddress: string) {
    try {
      const response = await this.client.getOwnedObjects({
        owner: userAddress,
        options: {
          showType: true,
          showContent: true,
        },
      });

      // Filter to only AICouncil NFTs
      return response.data.filter((obj) => {
        const type = (obj.data?.type as string) || '';
        return type.includes('DisagreementNFT');
      });

    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }
}

export default SuiNFTMinter;
export { DisagreementNFT, MintResult };
