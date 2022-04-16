package org.hihn.ampd.server.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.bff.javampd.album.MPDAlbum;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class MpdAlbumJsonComponent {

	public static class Deserializer extends JsonDeserializer<MPDAlbum> {

		@Override
		public MPDAlbum deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
				throws IOException {

			JsonNode node = jsonParser.getCodec().readTree(jsonParser);
			String name = node.get("name").asText();
			String artistName = node.get("artistName").asText();
			String date = node.get("date").asText();
			String genre = node.get("genre").asText();

			MPDAlbum mpdAlbum = new MPDAlbum(name, artistName);
			mpdAlbum.setDate(date);
			mpdAlbum.setGenre(genre);
			return mpdAlbum;
		}

	}

}
