import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShortlinkDocument = HydratedDocument<Shortlink>;

@Schema()
export class Shortlink {
    @Prop({required: true})
    alias: string;

    @Prop({required: true})
    url: string;

    @Prop()
    createdAt: Date;

    @Prop({default: true})
    active: boolean;
}

export const ShortlinkSchema = SchemaFactory.createForClass(Shortlink);

ShortlinkSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// to ensure virtual fields are serialised.
ShortlinkSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});