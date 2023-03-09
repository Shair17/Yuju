import React from 'react';
import {StatusBar} from 'react-native';
import {Div, Image} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {Separator} from '@yuju/components/atoms/Separator';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {FAQTitle} from '@yuju/components/atoms/FAQTitle';
import {FAQItem} from '@yuju/components/atoms/FAQItem';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'HelpCenterScreen'> {}

export const HelpCenterScreen: React.FC<Props> = () => {
  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Div h={200} justifyContent="center" mb="lg">
          <Image
            resizeMode="contain"
            source={require('@yuju/assets/images/support-bg.png')}
            flex={1}
          />
        </Div>

        <Div mb="lg">
          <FAQTitle title="Sobre Yuju" />

          <FAQItem
            title="¿Yuju es gratis?"
            content="Sí, Yuju es gratis para todos los usuarios de la aplicación hoy siempre."
          />

          <FAQItem
            title="¿Cómo funciona Yuju?"
            content="En el momento que solicitas un mototaxi, un mototaxista cercano autorizado por Yuju llegará hasta tu ubicación y te llevará a tu destino."
          />

          <FAQItem
            title="¿Yuju está disponible 24/7?"
            content="Siempre y cuando hayan mototaxistas disponibles, Yuju estará para servirte. Por nuestro lado mantenemos nuestro servicio disponible 24/7."
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <FAQTitle title="Mis Datos" />

          <FAQItem
            title="¿Qué datos debo proporcionar para usar Yuju?"
            content="Los únicos datos que necesitas para usar Yuju son tus nombres y apellidos, tu correo electrónico, tu número de teléfono, tu número de DNI, tu ubicación y tu foto de perfil, no todos los datos son necesarios. (Algunos datos, como tus nombres y apellidos, foto de perfil y ubicación son obtenidos de forma automática en la aplicación)."
          />

          <FAQItem
            title="¿Por qué pedimos estos datos?"
            content="Porque es importante que tu información sea correcta, de lo contrario, no podremos proporcionarte una experiencia de usuario agradable y segura."
          />

          <FAQItem
            title="¿Mis datos están a salvo con Yuju?"
            content="Por supuesto, Yuju es seguro, tus datos nunca serán compartidos con nadie. Debido a esto, no hay ningún tipo de riesgo para ti, ya que solo necesitas una cuenta de Facebook para iniciar sesión con presionar un solo botón."
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <FAQTitle title="Pograma de Referidos" />

          <FAQItem
            title="¿Cómo funciona el programa de referidos en Yuju?"
            content="Cuando invitas a tus amigos a Yuju mediante tu código (se genera automáticamente) acumulas puntos que se canjean con dinero, carreras, premios y sorteos patrocinados por Yuju o sus distintas asociaciones."
          />

          <FAQItem
            title="¿Hay un máximo de referidos por persona?"
            content="Sí, cada persona puede referir hasta 10 personas."
          />

          <FAQItem
            title="Ya alcancé el límite de referidos, ¿Cómo reclamo mis premios o beneficios?"
            content="Nosotros nos pondremos en contacto contigo, por eso es importante completar tu perfil con tus datos reales."
          />

          <FAQItem
            title="¿Cómo comparto mi código de referido?"
            content="Compartir tu código es fácil, ve a Inicio y encontrarás un widget promocionando tu código de referido, puedes compartirlo haciendo clic en el icono de compartir o copiar código."
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <FAQTitle title="Forma parte de Yuju" />

          <FAQItem
            title="Soy mototaxista, ¿Puedo trabajar con Yuju?"
            content="Por supuesto que sí, si trabajas de manera independiente como mototaxista de manera legal, entonces ya cumples con todos los requisitos para formar parte de Yuju, lo que sigue es registrarte como mototaxista de manera gratuita en la aplicación de Yuju para Mototaxistas."
          />

          <FAQItem
            title="Quiero formar parte de Yuju de otra forma, ¿Cómo puedo hacerlo?"
            content="Si quieres formar parte de Yuju y ayudar a mejorar el servicio de mototaxi haciendolo más rápido, seguro y confiable puedes contactarnos y/o seguirnos en todas nuestras redes sociales."
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <FAQTitle title="Ayúdanos" />

          <FAQItem
            title="Me gusta Yuju, ¿Cómo puedo ayudar?"
            content="Nos ayudas muchísimo usando la aplicación y compartiendola con tus amigos, si quieres ayudarnos de otra forma no dudes en contactarnos."
          />

          <FAQItem
            title="Si los ayudo, ¿Obtendré algún beneficio?"
            content="Sí, puedes contactarnos para hablar sobre tus beneficios al ayudar a Yuju."
          />
        </Div>
      </Div>
    </ScrollScreen>
  );
};
