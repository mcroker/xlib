﻿


/** for all supported db types, see: https://cloud.google.com/datastore/docs/concepts/entities#properties_and_value_types		
*/
export type DbType = "string" | "double" | "integer" | "boolean" | "date" | "blob" | "none";



export interface IPropertySchema<TValue> {

	//value?: TValue; //move runtime values to a seperate "entity" type
	default?: TValue;
	/** if input and storage of this field is optional.  if so, then will store NULL on the database for this property if it is not set.
	if you have a calculated field (using this.dbWriteTransform()) then this can be set to false, and this.isHidden set to true  (to avoid the user being required to fill it in)
	*/
	isOptional?: boolean;
	/** if this field is hidden from user input (set on the server side).  note that if both .isOptional and .isHidden are true, it means the property is required to be set on the server before writing to the db. */
	isHidden?: boolean;
	/** how this should be stored in the database.   use "none" to not store the field in the db */
	dbType: DbType;
	/** by default all properties are indexed (add +1x the entity size for each indexed field!  expensive!)  so you can disable this for properties that you know are not going to be sorted by, if a large number of entities of that kind need to be stored. */
	isDbIndexExcluded?: boolean;

	/** can set an  input type, used when using the react-jsonschema-form react plugin.   used as it's "type" field.
	if left undefined, user input will be as default which should usually be "string"
	review inputText types found at https://www.npmjs.com/package/react-jsonschema-form for choices
	 */
	inputType?: string;
	/** sets the type of bootstrap widget used */
	inputWidget?: string;
	/** optional, used for Jsf input */
	inputFormat?: string;

	/** set this to modify the value as it's being written to the database.  For example, lets you set an "updateDate" timestamp */
	dbWriteTransform?: <TDbType>(/** current property value that needs to be transformed */value?: TValue) => { /**update this property's value with the modified value.  if you don't update it, simply return the input value*/ value: TValue; /** value written to the database*/ dbValue: TDbType };
	/** transform the value as it's read back from the database */
	dbReadTransform?: <TDbType>(/**value read from the db that needs to be transformed*/ dbValue?: TDbType) => TValue;
}


export interface IStringProperty extends IPropertySchema<string> {
	inputType?: "string";
	inputWidget?: "textarea" | "password" | "color" | "string";
	inputFormat?: "email" | "uri" | "data-url" | "date" | "date-time";
	dbType: "string" | "none";
	/** if true, keeps empty strings, otherwise converts to null (when input or writing to db) 
	this is a "shortcut", you could do this via a dbWriteTransform() instead if you wish.  if set, this executes before dbWriteTransform */
	allowEmpty?: boolean;
	/** if true, will convert to lowercase when input and when writing to db.  
	this is a "shortcut", you could do this via a dbWriteTransform() instead if you wish.  if set, this executes before  dbWriteTransform */
	toLowercaseTrim?: boolean;
}

export interface IDateProperty extends IPropertySchema<Date> {
	inputType?: "string";
	inputWidget?: "string";
	inputFormat: "date" | "date-time";
	dbType: "date" | "none";
}
export interface IBooleanProperty extends IPropertySchema<boolean> {
	dbType: "boolean" | "none";
}

export interface INumberProperty extends IPropertySchema<number> {
	dbType: "double" | "integer" | "none";
	inputType?: "number" | "integer";
	inputWidget?: "updown" | "range" | "string";
	minimum?: number;
	maximum?: number;
	multipleOf?: number;
}

export interface IDoubleProperty extends INumberProperty {
	dbType: "double" | "none";
}
export interface IIntegerProperty extends INumberProperty {
	dbType: "integer" | "none";
}

export interface ISchema { //<TData, TEntity extends IEntity<TData>> {

	properties: {
		[propertyName: string]: IPropertySchema<any>;
	}

	db: {
		kind: string;
		/** default false.   if true, will not raise errors on invalid schema from the database reads/writes */
		suppressInvalidSchemaErrors?: boolean;
		/** default false.   if true, will raise an error if the namespace is not specified */
		isNamespaceRequired?: boolean;
	}

	//entityTemplate: TEntity

}
