import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

interface EntityInitializerInterface {
	newFromSerialization( entity: any ): FingerprintableEntity;
}

export default EntityInitializerInterface;
