import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

interface EntityInitializerInterface {
	newFromSerialization( entity: unknown ): FingerprintableEntity;
}

export default EntityInitializerInterface;
