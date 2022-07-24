package org.hihn.ampd.server.service;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.serializer.BackendSettings;
import org.hihn.ampd.server.serializer.HelpText;
import org.hihn.ampd.server.serializer.Types;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmpdSettingsService {

	private static final Logger LOG = LoggerFactory.getLogger(AmpdSettingsService.class);

	private final AmpdSettings ampdSettings;

	public AmpdSettingsService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	public List<BackendSettings> getFields() {
		return FieldUtils.getFieldsListWithAnnotation(AmpdSettings.class, HelpText.class).stream().map(field -> {
			HelpText annotation = field.getAnnotation(HelpText.class);
			String value = "";
			field.setAccessible(true);
			String type = getType(String.valueOf(field.getType()));
			try {
				value = String.valueOf(field.get(ampdSettings));
			}
			catch (IllegalAccessException e) {
				LOG.error("Error retrieving value for: {}", field.getName());
			}
			return new BackendSettings(annotation.name(), annotation.hint(), field.getName(), type, value);
		}).collect(Collectors.toList());
	}

	private String getType(String type) {
		switch (type) {
			case "int":
				return Types.INT.getType();
			case "boolean":
				return Types.BOOL.getType();
			default:
				return Types.STR.getType();
		}
	}

}
