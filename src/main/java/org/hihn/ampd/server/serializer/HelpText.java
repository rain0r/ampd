package org.hihn.ampd.server.serializer;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Class members with this annotation provide the labels for the backend settings.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface HelpText {

	/**
	 * Name of the backend setting.
	 */
	String name() default "";

	/**
	 * Used inside the hint-field on client side.
	 */
	String hint() default "";

}
