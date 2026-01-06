package org.hihn.ampd.server.service;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.serializer.BackendSettings;
import org.hihn.ampd.server.serializer.HelpText;
import org.hihn.ampd.server.serializer.Types;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettingsService {

	private static final Logger LOG = LoggerFactory.getLogger(SettingsService.class);

	private final AmpdSettings ampdSettings;

	public SettingsService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	public List<BackendSettings> getFields() {
		return FieldUtils.getFieldsListWithAnnotation(AmpdSettings.class, HelpText.class).stream().map(field -> {
			HelpText annotation = field.getAnnotation(HelpText.class);

			Value property_name = field.getAnnotation(Value.class);
			String key = property_name.value().split(":")[0].substring(2);

			String value = "";
			field.setAccessible(true);
			String type = getType(String.valueOf(field.getType()));
			try {
				value = String.valueOf(field.get(ampdSettings));
			}
			catch (IllegalAccessException e) {
				LOG.error("Error retrieving value for: {}", field.getName());
			}
			return new BackendSettings(annotation.name(), annotation.hint(), key, type, value);
		}).collect(Collectors.toList());
	}

	private String getType(final String type) {
		return switch (type) {
			case "int" -> Types.INT.getType();
			case "boolean" -> Types.BOOL.getType();
			default -> Types.STR.getType();
		};
	}

}
